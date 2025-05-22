import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import API from "../services/api";

const MemberList = ({user, group, memberMap, onRemoveMember }) => {
  const [emailMap, setEmailMap] = useState({});

  useEffect(() => {
    const fetchEmails = async () => {
      if (!group?.members || group.members.length === 0) return;

      try {
        const { data } = await API.post("/api/users/email", {
          ids: group.members,
        });
        setEmailMap(data);
      } catch (err) {
        console.error("Error fetching member emails:", err.message);
      }
    };

    fetchEmails();
  }, [group]);

  if (!group || !group.members || !memberMap) return <p>Loading members...</p>;

  const dataSource = group.members.map((memberId) => ({
    key: memberId,
    name: memberMap[memberId] || memberId,
    email: emailMap[memberId] || "-",
  }));

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button 
          danger 
          onClick={() => onRemoveMember?.(record.key, record.email)}
          disabled={group.createdBy !== user.id}
          >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div className="members-list">
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default MemberList;
