import { useEffect } from "react";
import { useState } from "react";

const DetailsUser = () => {
  const [detailsUser, setDetailsUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const role = "client";

  useEffect(() => {
    const fetchDetailsUser = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/role/${role}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setDetailsUser(data);
        setLoading(false);
        setError(null);
        console.log(data);
      } else {
        throw new Error(data.message || "Failed to fetch user details");
      }
    };
    fetchDetailsUser();
  }, [role]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (detailsUser) {
    return <div>No user details found</div>;
  }

  return (
    <div>
      <h1>Details User</h1>
      {detailsUser.map((user) => (
        <div key={user._id}>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Role: {user.role}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};
export default DetailsUser;
