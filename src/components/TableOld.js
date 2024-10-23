        // <div>
        //     {data.length > 0 ? (
        //         <table className="min-w-full divide-y divide-gray-700 ">
        //             <thead className='border-b-2 border-[#181A20]' style={{ position: 'sticky', top: 0, backgroundColor: '#181A20', zIndex: 10, marginBottom: '50px' }}>
        //                 <tr>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">#</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Level</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Age</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ping</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Google Status</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Malady</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Proxy</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">World</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Uptime</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Task</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Position</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gems</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Obtained Gems</th>
        //                     <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Actions</th>
        //                 </tr>
        //             </thead>
        //             <tbody className="divide-y divide-gray-700" style={{ marginTop: '8px' }}>
        //                 {data.map((item, index) => {
        //                     const previousItem = previousData[index] || {};
        //                     const isGemsUpdated = item.details.gems !== previousItem.details?.gems;
        //                     const isLevelUpdated = item.details.level !== previousItem.details?.level;
        //                     const isAgeUpdated = item.details.age !== previousItem.details?.age;
        //                     const isPingUpdated = item.details.ping !== previousItem.details?.ping;
        //                     const isStatusUpdated = item.details.status !== previousItem.details?.status;
        //                     const isGoogleStatusUpdated = item.details.google_status !== previousItem.details?.google_status;
        //                     const isMaladyUpdated = item.details.malady !== previousItem.details?.malady;
        //                     const isProxyUpdated = item.details.proxy !== previousItem.details?.proxy;
        //                     const isWorldUpdated = item.details.world !== previousItem.details?.world;
        //                     const isUptimeUpdated = item.details.online_time !== previousItem.details?.online_time;
        //                     const isTaskUpdated = item.details.task !== previousItem.details?.task;
        //                     const isPositionUpdated = item.details.position !== previousItem.details?.position;
        //                     const isObtainedGemsUpdated = item.details.obtained_gems !== previousItem.details?.obtained_gems;

        //                     return (
        //                         <tr key={index} className="border-t">
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isLevelUpdated ? 'glow-update' : ''} text-center`}>
        //                                 {item.details.index}
        //                             </td>
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isLevelUpdated ? 'glow-update' : ''}`}>
        //                                 {item.details.name}
        //                             </td>
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isLevelUpdated ? 'glow-update' : ''}`}>
        //                                 Lv. {item.details.level}
        //                             </td>
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isAgeUpdated ? 'glow-update' : ''}`}>
        //                                 {item.details.age} days
        //                             </td>
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isPingUpdated ? 'glow-update' : ''}`}>
        //                                 {item.details.ping} ms
        //                             </td>
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isStatusUpdated ? 'glow-update' : ''} ${item.details.status === 'Online' ? 'text-green-500' : 'text-red-500'}`}>
        //                                 <span>
        //                                     {item.details.status} 
        //                                     {item.details.is_script_run && (
        //                                         <span>[&lt;/&gt;]</span>
        //                                     )}

        //                                     {item.details.is_resting && (
        //                                         <span style={{ color: 'orange' }}>[Resting]</span>
        //                                     )}
        //                                 </span>
        //                             </td>
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isGoogleStatusUpdated ? 'glow-update' : ''} ${item.details.google_status === 'Idle' ? 'text-green-500' : 'text-red-500'}`}>
        //                                 {item.details.google_status}
        //                             </td>
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isMaladyUpdated ? 'glow-update' : ''}`}>
        //                                 <div className="flex items-center">
        //                                     {MaladySprites(item.details.malady)}
        //                                     <span className="ml-2 flex-1 min-w-[50px]">{item.details.malady}</span> {/* Set a minimum width */}
        //                                 </div>
        //                             </td>

        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isProxyUpdated ? 'glow-update' : ''}`}>
        //                                 {item.details.proxy}
        //                             </td>
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isWorldUpdated ? 'glow-update' : ''}`}>
        //                                 {item.details.world}
        //                             </td>
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isUptimeUpdated ? 'glow-update' : ''}`}>
        //                                 {item.details.online_time}
        //                             </td>
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isTaskUpdated ? 'glow-update' : ''}`}>
        //                                 {item.details.task}
        //                             </td>
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isPositionUpdated ? 'glow-update' : ''}`}>
        //                                 {item.details.position}
        //                             </td>
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isGemsUpdated ? 'glow-update' : ''}`}>
        //                                 💎 {FormatNumber(item.details.gems)}
        //                             </td>
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${isObtainedGemsUpdated ? 'glow-update' : ''}`}>
        //                                 ⚜️ {FormatNumber(item.details.obtained_gems)}
        //                             </td>
        //                             <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow text-center`}>
        //                                 <ShowModal item={data[index]}></ShowModal>
        //                             </td>
        //                         </tr>
        //                     );
        //                 })}
        //             </tbody>
        //         </table>
        //     ) : (
        //         <div className="text-center p-4">No data available.</div>
        //     )}
        // </div>