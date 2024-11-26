import axios from "axios";
import Transaction from "../model/Bkash.js";

const BKASH_GEN_TOKEN_API_URL = process.env.BKASH_GEN_TOKEN_API;
const BKASH_CHECK_OUT_API_URL = process.env.BKASH_CHECK_OUT_API;

export const initBkash = async (req, res) => {
  const { totalAmount, merchantInvoiceNumber } = req.body;

  try {
    axios({
      url: BKASH_GEN_TOKEN_API_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        username: process.env.BKASH_USER_NAME,
        password: process.env.BKASH_PASSWORD,
      },
      data: {
        app_key: process.env.BKASH_APP_KEY,
        app_secret: process.env.BKASH_APP_SECRET,
      },
      timeout: 30000,
    })
      .then(({ data }) => {
        axios({
          url: BKASH_CHECK_OUT_API_URL,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-APP-Key": process.env.BKASH_APP_KEY,
            Accept: "application/json",
            Authorization: data.id_token,
          },
          data: {
            amount: totalAmount,
            currency: "BDT",
            intent: "sale",
            merchantInvoiceNumber: merchantInvoiceNumber,
          },
          timeout: 30000,
        })
          .then(({ data }) => {
            console.log("data", data);

            return res.json({
              status: "successful",
              data: data,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    return res.json({
      status: 404,
      msg: "not found",
    });
  }
};

export const execBkash = async (req, res) => {
  try {
    const { totalAmount, user, paymentID } = req.body;
    console.log(paymentID);
    const EXEC_URL = `${process.env.BKASH_EXEC_API}/${paymentID}`;

    axios({
      url: BKASH_GEN_TOKEN_API_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        username: process.env.BKASH_USER_NAME,
        password: process.env.BKASH_PASSWORD,
      },
      data: {
        app_key: process.env.BKASH_APP_KEY,
        app_secret: process.env.BKASH_APP_SECRET,
      },
      timeout: 30000,
    })
      .then(({ data }) => {
        console.log("token data", data);
        let token = data.id_token;

        axios({
          url: EXEC_URL,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-APP-Key": process.env.BKASH_APP_KEY,
            Authorization: token,
          },
          timeout: 30000,
        })
          .then(async ({ data }) => {
            console.log("data after exec =>", data);
            if (data?.errorCode) {
              return res.send(data);
            } else {
              console.log({
                totalAmount: totalAmount,
                transactionId: data.paymentID,
                userId: user,
                createdDate: new Date(),
              });

              const transaction = new Transaction({
                totalAmount: totalAmount,
                transactionId: data.paymentID,
                userId: user,
                createdDate: new Date(),
              });

              await transaction.save();

              return res.send({
                status: 200,
                msg: "successful",
              });
            }
          })
          .catch((err) => {
            console.log("I am here in error");
            console.log("err", err.message);
            axios({
              url: `${process.env.BKASH_QUERY_API}/${paymentID}`,
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-APP-Key": process.env.BKASH_APP_KEY,
                Authorization: token,
              },
              timeout: 30000,
            })
              .then(({ data }) => {
                res.send(data);
              })
              .catch((err) => {
                console.log(err);
              });
          });
      })
      .catch((err) => {
        res.json({
          status: 400,
          msg: "error occured during token generation",
        });
      });
  } catch (error) {}
};
