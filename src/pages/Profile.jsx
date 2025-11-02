import React, { useRef } from "react";

function Profile() {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100 justify-center items-start p-6">
      <div
        style={{
          maxWidth: 900,
          width: "100%",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          fontFamily: "sans-serif",
          overflow: "visible",
        }}
      >
        {/* Banner */}
        <div
          style={{
            background:
              "url('https://img.freepik.com/free-vector/hand-painted-tropical-leaves-background_23-2148947404.jpg')",
            backgroundSize: "cover",
            height: 140,
            position: "relative",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          {/* Avatar (Absolute overlap) */}
          <div
            style={{
              position: "absolute",
              left: 30,
              bottom: -40,
              width: 100,
              height: 100,
              borderRadius: "50%",
              backgroundColor: "#fff",
              border: "4px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              zIndex: 10,
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="avatar"
              style={{ width: 80, height: 80, borderRadius: "50%" }}
            />
          </div>
        </div>

        {/* Profile Header Info */}
        <div
          style={{
            marginTop: 50,
            padding: "0 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {/* Info next to avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>Employee Name</div>
              <div style={{ color: "#777", fontSize: 15 }}>UI/UX Designer</div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                  alt="fb"
                  width={22}
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                  alt="ig"
                  width={22}
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                  alt="in"
                  width={22}
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
                  alt="gh"
                  width={22}
                />
              </div>
            </div>
          </div>

          {/* Edit button */}
          <button
            style={{
              background: "#0097A7",
              color: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "8px 20px",
              fontWeight: 600,
              cursor: "pointer",
              marginTop: 0,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            Edit Image
          </button>
        </div>

        {/* Details */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "20px 30px",
            fontSize: 15,
            color: "#333",
          }}
        >
          <div style={{ flex: "1 1 50%", marginBottom: 10 }}>
            <b>ID:</b> Employee ID
          </div>
          <div style={{ flex: "1 1 50%", marginBottom: 10 }}>
            <b>Phone:</b> +947XXXXXXXX
          </div>
          <div style={{ flex: "1 1 50%", marginBottom: 10 }}>
            <b>Email:</b> Employee@gmail.com
          </div>
          <div style={{ flex: "1 1 50%", marginBottom: 10 }}>
            <b>Date of Birth:</b> dd/mm/yy
          </div>
          <div style={{ flex: "1 1 50%", marginBottom: 10 }}>
            <b>Address:</b> Employee Address
          </div>
          <div style={{ flex: "1 1 50%", marginBottom: 10 }}>
            <b>Passport:</b> A12345678
          </div>
          <div style={{ flex: "1 1 50%", marginBottom: 10 }}>
            <b>Age:</b> 25 Yr
          </div>
          <div style={{ flex: "1 1 50%", marginBottom: 10 }}>
            <b>NIC:</b> 2001*******
          </div>
        </div>

        {/* File Upload */}
        <div
          style={{
            margin: "0 30px 30px",
            display: "flex",
            alignItems: "center",
            background: "#f5f5f5",
            borderRadius: 10,
            padding: "12px 16px",
            cursor: "pointer",
            width: 180,
          }}
          onClick={handleFileClick}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
            alt="pdf"
            width={28}
            style={{ marginRight: 10 }}
          />
          <span style={{ fontWeight: 600, color: "#666" }}>CV.PDF</span>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".pdf"
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
