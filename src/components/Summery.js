import React from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 0.4rem 1rem;
  border-radius: 16px;
  background: #f9f9f9;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
`;

const DebtCard = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
  }
`;

const Name = styled.span`
  font-weight: 500;
  font-size: 1rem;
`;

const Amount = styled.span`
  color: #28a745;
  font-weight: bold;
  font-size: 1rem;
`;

const SettledCard = styled.div`
  background-color: #e6ffed;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  font-weight: bold;
  border: 1px solid #c8e6c9;
`;

const Summary = ({ balanceList, getUserName }) => {
  return (
    <Container>
      <Title>Summary</Title>

      {balanceList.length === 0 ? (
        <SettledCard>🎉 All Settled! No dues left.</SettledCard>
      ) : (
        balanceList.map((item, index) => (
          <DebtCard key={index}>
            <Name>
              {getUserName(item.from)} owes {getUserName(item.to)}
            </Name>
            <Amount>₹{item.amount}</Amount>
          </DebtCard>
        ))
      )}
    </Container>
  );
};

export default Summary;
