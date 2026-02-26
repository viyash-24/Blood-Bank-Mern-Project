import React from "react";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";

const AdminHome = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Layout>
      <div className="container">
        <div className="d-felx flex-column mt-4">
          <h1>
            Welcome Admin <i className="text-success">{user?.name}</i>
          </h1>
          <h3>Manage Blood Bank App </h3>
          <hr />
          <p >
           Our Blood Bank Application is a role-based management system developed primarily for blood service operations. The system is designed to efficiently connect and manage four main user roles: Donors, Organizations, Hospitals, and Administrators. Each user type has specific permissions and responsibilities within the platform to ensure smooth and secure blood bank operations.<br /><br />


Donors can register through the application and create their profiles by providing necessary personal and blood group details. Similarly, organizations and hospitals can also register and join the system. Once registered and approved, donors can contribute blood, and the blood bank staff records and safely stores the donated blood in the system. The application maintains detailed records of blood type, quantity, storage status, and availability to ensure proper management and quick access when needed.<br /><br />

Hospitals and authorized organizations can easily request blood units through the platform whenever required. The system allows efficient tracking and distribution of blood based on availability, ensuring that patients receive blood without unnecessary delays. After registration, users can update their relevant details, manage requests, and monitor the status of blood availability in real time.<br /><br />

The Administrator has full control over the system. The admin can manage donor, organization, and hospital accounts, including adding, updating, approving, or deleting records. Additionally, the administrator oversees blood inventory management, monitors system activities, and ensures that all operations are conducted accurately and securely.<br /><br />

Overall, the Blood Bank Application provides a structured, transparent, and efficient digital solution for managing blood donations, storage, and distribution while improving coordination between donors, hospitals, and organizations.

          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHome