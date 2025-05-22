import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { Modal, Button, Input, message, Select, Spin } from "antd";
import API from "../services/api";

const CreateGroup = ({
  setModalOpen,
  onGroupCreated,
  allUsers,
  modalOpen,
  loadingUsers,
}) => {
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      message.warning("Please enter a group name");
      return;
    }

    if (selectedMembers.length === 0) {
      message.warning("Please select at least one member");
      return;
    }

    const selectedUserEmails = allUsers
      .filter((u) => selectedMembers.includes(u._id))
      .map((u) => u.email);

    const payload = {
      name: groupName,
      memberEmails: selectedUserEmails,
    };

    try {
      await API.post("/group", payload);
      message.success("✅ Group created successfully");
      setGroupName("");
      setSelectedMembers([]);
      setModalOpen(false);
      if (onGroupCreated) onGroupCreated();
    } catch (err) {
      message.error("❌ Failed to create group");
    }
  };

  return (
    <div>
      <Button
        type="text"
        icon={<FaUserPlus />}
        onClick={() => setModalOpen(true)}
      >
        Create Group
      </Button>
      <Modal
        title="Create New Group"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setGroupName("");
          setSelectedMembers([]);
        }}
        onOk={handleCreateGroup}
        okText="Create"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        {loadingUsers ? (
          <Spin />
        ) : (
          <Select
            mode="multiple"
            placeholder="Select members"
            style={{ width: "100%" }}
            value={selectedMembers}
            onChange={(value) => setSelectedMembers(value)}
            options={allUsers.map((u) => ({
              label: `${u.name} (${u.email})`,
              value: u._id,
            }))}
          />
        )}
      </Modal>
    </div>
  );
};

export default CreateGroup;
