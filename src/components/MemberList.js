import React from "react";

const MemberList = ({group, memberMap}) => {
  return (
    <div className="members-list">
      <ul>
        {group.members.map((member) => (
          <li key={member}>{memberMap[member] || member}</li>
        ))}
      </ul>
    </div>
  );
};


export default MemberList