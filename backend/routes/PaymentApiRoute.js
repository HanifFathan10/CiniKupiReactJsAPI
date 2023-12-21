import express from "express";
import { GetTokenForPayment } from "../controller/PaymentApiController.js";

const PaymentRoute = express.Router();

PaymentRoute.post("/token", GetTokenForPayment);

export default PaymentRoute;
