import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

// Colors for PieChart
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA00FF",
  "#FF4081",
  "#795548",
  "#607D8B",
];

// Styled Components
const Container = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
`;

const FilterSelect = styled.select`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  font-size: 14px;
`;

const TotalExpense = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  background: #4caf50;
  color: white;
  border-radius: 6px;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const ChartBox = styled.div`
  padding: 20px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

// Component
const GroupStatistics = ({ expenses, memberMap }) => {
  const [barChartData, setBarChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const userStats = {}; 
    const categoryStats = {}; 
    let total = 0;

    const today = new Date();
    const filteredExpenses = expenses.filter((expense) => {
      const createdAt = new Date(expense.createdAt);
      if (filter === "today") {
        return createdAt.toDateString() === today.toDateString();
      } else if (filter === "thisWeek") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return createdAt >= startOfWeek && createdAt <= today;
      }
      return true;
    });

    filteredExpenses.forEach((expense) => {
      const { paidBy, amount, splitBetween, category = "Uncategorized" } = expense;
      total += amount;

      if (!userStats[paidBy]) {
        userStats[paidBy] = { name: memberMap?.[paidBy] || paidBy, paid: 0, owed: 0, owes: 0 };
      }
      userStats[paidBy].paid += amount;

      const share = amount / splitBetween.length;
      splitBetween.forEach((userId) => {
        if (!userStats[userId]) {
          userStats[userId] = { name: memberMap?.[userId] || userId, paid: 0, owed: 0, owes: 0 };
        }
        userStats[userId].owed += share;
        if (userId !== paidBy) {
          userStats[userId].owes += share;
        }
      });

      categoryStats[category] = (categoryStats[category] || 0) + amount;
    });

    setTotalExpense(total);
    setBarChartData(Object.values(userStats));

    const formattedCategories = Object.entries(categoryStats).map(([category, value]) => ({ name: category, value }));
    setCategoryData(formattedCategories);
  }, [expenses, memberMap, filter]);

  return (
    <Container>
      <Header>
        <Title>Group Statistics</Title>
        <FilterContainer>
          <FilterLabel htmlFor="timeFilter">Time Range:</FilterLabel>
          <FilterSelect id="timeFilter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
          </FilterSelect>
        </FilterContainer>
      </Header>

      <TotalExpense>Total Expense: ₹{totalExpense.toFixed(2)}</TotalExpense>

      <ChartsContainer>
        <ChartBox>
          <h2>Member-wise Contributions</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="paid" stackId="a" fill="#4caf50" name="Paid" />
              <Bar dataKey="owed" stackId="a" fill="#2196f3" name="Owed" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <h2>Category-wise Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsContainer>
    </Container>
  );
};

export default GroupStatistics;
