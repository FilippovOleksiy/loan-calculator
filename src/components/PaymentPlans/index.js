import React, { useState, useEffect, memo } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import EnhancedTableHead from "./components/EnhancedTableHead";
import initialData from "../../assets/payment-plan-initial.json";
import paymentCalculator from "../../services/payment-plan-calculator";
import { stableSort, getSorting } from "../../utils/utils";

const {
  exceptions: { amountForLongPaymentPlan, smallestInstallment },
} = initialData;

const commonInformation = [
  { id: "loanTerm", label: "Loan Term" },
  { id: "monthlyInstallment", label: "Monthly installment" },
  { id: "totalAmount", label: "Total amount" },
];

const detailedInformation = [
  { id: "capitalLeft", label: "Capital left to pay" },
  { id: "monthlyInterest", label: "Monthly interest" },
  { id: "monthlyFeeToPay", label: "Monthly fee" },
];

const preparePaymentPlans = ((paymentPlans) => (amount) => {
  return paymentPlans
    .filter((plan) => {
      let result = true;
      if (plan.loanTerm === 60 && amount <= amountForLongPaymentPlan) {
        result = false;
      }
      return result;
    })
    .map((plan) => paymentCalculator(plan)(amount))
    .filter(
      (paymentPlan) => paymentPlan.monthlyInstallment >= smallestInstallment
    );
})(initialData.paymentPlans);

const PaymentPlans = ({ amount }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("totalAmount");
  const [detailsToShow, setDetailsToShow] = useState(-1);
  const [paymentPlans, setPaymentPlans] = useState([]);

  useEffect(() => {
    setPaymentPlans(preparePaymentPlans(amount));
  }, [amount]);

  const onSortHandler = (event, newOrder) => {
    setOrder(order === "desc" ? "asc" : "desc");
    setOrderBy(newOrder);
  };

  const onClick = (index) => () => {
    if (detailsToShow === index) {
      index = -1;
    }
    setDetailsToShow(index);
  };

  return (
    <div>
      <div className="common-info-table">
        <Paper>
          <Table>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              columns={commonInformation}
              onSortHandler={onSortHandler}
            />
            <TableBody>
              {stableSort(paymentPlans, getSorting(order, orderBy)).map(
                (paymentPlan, index) => {
                  const {
                    loanTerm,
                    monthlyInstallment,
                    totalAmount,
                  } = paymentPlan;
                  return (
                    <tr
                      key={index}
                      className="table-row"
                      onClick={onClick(index)}
                    >
                      <TableCell align={"center"}>{loanTerm}</TableCell>
                      <TableCell align={"center"}>
                        {monthlyInstallment.toFixed(2)}
                      </TableCell>
                      <TableCell align={"center"}>
                        {totalAmount.toFixed(2)}
                      </TableCell>
                    </tr>
                  );
                }
              )}
            </TableBody>
          </Table>
        </Paper>
      </div>
      <Paper>
        <Table>
          <EnhancedTableHead columns={detailedInformation} />
          <TableBody>
            {detailsToShow !== -1 &&
              paymentPlans[detailsToShow].paymentsInformation.map(
                (information, index) => {
                  const { capitalLeft, monthlyInterest } = information;
                  return (
                    <TableRow hover key={index}>
                      <TableCell align={"center"}>
                        {capitalLeft.toFixed(2)}
                      </TableCell>
                      <TableCell align={"center"}>
                        {monthlyInterest.toFixed(3)}
                      </TableCell>
                      <TableCell align={"center"}>
                        {paymentPlans[detailsToShow].monthlyFeeToPay}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default memo(PaymentPlans);
