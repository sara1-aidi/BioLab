const PerformanceSummary = () => {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
        <div className="space-y-4">
          {[
            { label: 'Sample Processing', value: 78 },
            { label: 'Report Delivery', value: 92 },
            { label: 'Patient Satisfaction', value: 85 },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default PerformanceSummary;