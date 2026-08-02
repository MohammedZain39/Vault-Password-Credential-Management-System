import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ padding: "30px" }}>
        {children}
      </div>
    </>
  );
}

export default MainLayout;