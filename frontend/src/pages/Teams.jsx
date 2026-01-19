import { useState } from "react";
import AddTeamModal from "../components/AddTeamModal";
import "../styles/teams.css";

const Teams = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="teams-page">
      <div className="teams-header">
        <h2>Teams</h2>
        <button className="add-team-btn" onClick={() => setOpen(true)}>
          + Add Team
        </button>
      </div>

      <div className="teams-empty">
        No team members added yet.
      </div>

      {open && <AddTeamModal onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Teams;







// import { useState } from "react";
// import AddTeamModal from "../components/AddTeamModal";
// import "../styles/teams.css";

// const Teams = () => {
//   const [open, setOpen] = useState(false);
//   const [refresh, setRefresh] = useState(false);

//   const handleClose = () => {
//     setOpen(false);
//     setRefresh(!refresh); // future: reload team list
//   };

//   return (
//     <div className="teams-page">
//       <div className="teams-header">
//         <h2>Teams</h2>
//         <button
//           className="add-team-btn"
//           onClick={() => setOpen(true)}
//         >
//           + Add Team
//         </button>
//       </div>

//       <div className="teams-empty">
//         No team members added yet.
//       </div>

//       {open && <AddTeamModal onClose={handleClose} />}
//     </div>
//   );
// };

// export default Teams;
