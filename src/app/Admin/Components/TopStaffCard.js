const TopStaffCard = () => {
    const staff = [
      { name: "Dr. Amina Salah", role: "Pathologist", tests: 340 },
      { name: "Dr. Karim Belkacem", role: "Radiologist", tests: 280 },
      { name: "Nurse Sarah", role: "Technician", tests: 190 },
    ];
  
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
        <ul className="space-y-4">
          {staff.map((person, index) => (
            <li key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{person.name}</p>
                <p className="text-sm text-gray-500">{person.role}</p>
              </div>
              <span className="text-blue-600 font-semibold text-sm">{person.tests} tests</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default TopStaffCard;