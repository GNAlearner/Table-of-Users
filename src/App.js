import { useEffect, useState } from "react";

const API = "https://jsonplaceholder.typicode.com/users";

const App = () => {

  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(0);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAddress, setEditAddress] = useState({ street: "", suite: "", city: "", zipcode: "" });

  const fetchUsers = async (API) => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setUsers(data);
    } catch (e) {
      console.log(e);
    }
  }

  const handleEdit = (id) => {
    users.forEach((user) => {
      if (user.id === id) {
        setEditId(user.id);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditAddress({ street: user.address.street, suite: user.address.suite, city: user.address.city, zipcode: user.address.zipcode });
      }
    })
  }

  const onChangeAddress = (e) => {
    setEditAddress({ ...editAddress, [e.target.name]: e.target.value });
  }

  const handleDelete = (id) => {
    const editedUsers = users.filter((user) => user.id !== id)
    setUsers(editedUsers);
  }

  const validate = () => {
    if(editName.length<2){
      return 'Name should contain 2 or more letters';
    }
    if(editEmail.length===0){
      return 'Email is required';
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailPattern.test(editEmail)){
      return 'Email is invalid';
    }
    if(editAddress.city.length<2){
      return 'City should contain 2 or more letters';
    }
    if(editAddress.zipcode.length===0){
      return 'Zipcode is required';
    }
    const zipPattern = /^[0-9-]+$/
    if(!zipPattern.test(editAddress.zipcode)){
      return 'Zipcode is invalid (Only numbers and hyphens are allowed)';
    }
    return "success";
  }

  const handleEditSubmit = () => {
    if(validate()==="success"){
    const editedUsers = users.map((user) => {
      if (user.id === editId) {
        return {
          id: editId,
          name: editName,
          email: editEmail,
          address: {
            street: editAddress.street,
            suite: editAddress.suite,
            city: editAddress.city,
            zipcode: editAddress.zipcode
          }
        }
      } else {
        return user;
      }
    })
    setUsers(editedUsers);
    setEditId(0);
    }else{
      alert(validate());
    }
  }

  const refreshData = () => {
    fetchUsers(API);
  }

  useEffect(() => {
    fetchUsers(API);
  }, [])

  return (
    <div className="container">
      {users.length === 0 ?
        <div>
          <h1>No Data Available</h1>
          <button className="refresh-btn-empty" onClick={refreshData}>Refresh</button>
        </div> : <table>
          <thead>
            <tr>
              <th className="ID_column">ID</th>
              <th className="name_column">Name</th>
              <th>Email</th>
              <th className="address_column">Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((curUser) => (
              editId === curUser.id ?
                <tr key={curUser.id}>
                  <td>{curUser.id}</td>
                  <td><input type="text" placeholder="Enter Name (Required)" value={editName} onChange={(e) => setEditName(e.target.value)} /></td>
                  <td><input type="text" placeholder="Enter Email (Required)" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} /></td>
                  <td>
                    <input type="text" placeholder="Enter Street" name="street" value={editAddress.street} onChange={onChangeAddress} />
                    <input type="text" placeholder="Enter Suite" name="suite" value={editAddress.suite} onChange={onChangeAddress} />
                    <input type="text" placeholder="Enter City (Required)" name="city" value={editAddress.city} onChange={onChangeAddress} />
                    <input type="text" placeholder="Enter zipcode (Required)" name="zipcode" value={editAddress.zipcode} onChange={onChangeAddress} />
                  </td>
                  <td><button className="save-btn" onClick={handleEditSubmit}>Update</button></td>
                </tr> :
                <tr key={curUser.id}>
                  <td>{curUser.id}</td>
                  <td>{curUser.name}</td>
                  <td>{curUser.email}</td>
                  <td>
                    {curUser.address.street?`${curUser.address.street}, `:""}
                    {curUser.address.suite?`${curUser.address.suite}, `:""}
                    {curUser.address.city} - {curUser.address.zipcode}
                    </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(curUser.id)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(curUser.id)}>Delete</button>
                    <button className="refresh-btn" onClick={refreshData}>Refresh</button>
                  </td>
                </tr>
            ))
            }
          </tbody>
        </table>}
    </div>
  );
}

export default App;
