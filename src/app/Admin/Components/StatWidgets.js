const StatWidgets = () => {
    const stats = [
      { title: "Total Tests", value: "1,248", icon: "🧪", change: "+8%", color: "bg-blue-100", trend: "up" },
      { title: "Pending Results", value: "87", icon: "⏳", change: "-4%", color: "bg-yellow-100", trend: "down" },
      { title: "Critical Alerts", value: "6", icon: "⚠️", change: "+12%", color: "bg-red-100", trend: "up" },
      { title: "Inventory Items", value: "412", icon: "📦", change: "0%", color: "bg-green-100", trend: "neutral" },
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div key={index} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex justify-between items-center mb-4">
              <div className={`p-3 rounded-full text-xl ${item.color}`}>{item.icon}</div>
              <div className={`text-sm ${
                item.trend === "up" ? "text-green-500" :
                item.trend === "down" ? "text-red-500" : "text-gray-400"
              }`}>
                {item.change} {item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "—"}
              </div>
            </div>
            <p className="text-gray-500 text-sm">{item.title}</p>
            <p className="text-2xl font-semibold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default StatWidgets;