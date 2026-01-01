const RecentTestsCard = () => {
    const tests = [
      { id: 'T-001', patient: 'John Doe', type: 'CBC', status: 'Completed' },
      { id: 'T-002', patient: 'Jane Smith', type: 'Lipid Panel', status: 'Pending' },
      { id: 'T-003', patient: 'Robert Fox', type: 'Glucose', status: 'In Progress' },
    ];
  
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Test Results</h3>
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={index} className="flex justify-between text-sm border-b pb-2">
              <div>
                <p className="font-medium">{test.patient}</p>
                <p className="text-gray-500">{test.type}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                test.status === 'Completed' ? 'bg-green-100 text-green-700' :
                test.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {test.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default RecentTestsCard;