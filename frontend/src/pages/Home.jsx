// import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <main
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 60px)",
            padding: "24px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2>Welcome to Dashboard</h2>
            <p>This is your home page content.</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
