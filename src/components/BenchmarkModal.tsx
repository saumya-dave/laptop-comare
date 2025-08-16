@@ .. @@
         const ctx = chartRef.current.getContext('2d');
         if (!ctx) return;

         const labels = chartData.map(d => d.name);
         const scores = chartData.map(d => d.score);
         const backgroundColors = chartData.map(d => 
-            d.name.toLowerCase().trim() === benchmark.name.toLowerCase().trim() ? '#06b6d4' : '#4b5563'
+            d.name.toLowerCase().trim() === benchmark.name.toLowerCase().trim() ? '#7c3aed' : '#6b7280'
         );
         const hoverBackgroundColors = chartData.map(d => 
-            d.name.toLowerCase().trim() === benchmark.name.toLowerCase().trim() ? '#0891b2' : '#6b7280'
+            d.name.toLowerCase().trim() === benchmark.name.toLowerCase().trim() ? '#6d28d9' : '#9ca3af'
         );

         chartInstanceRef.current = new ChartJS(ctx, {
@@ .. @@
                 scales: {
                     x: {
                         beginAtZero: true,
-                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
-                        ticks: { color: '#d1d5db', font: { size: 12 } }
+                        grid: { color: 'rgba(0, 0, 0, 0.1)' },
+                        ticks: { color: '#6b7280', font: { size: 12 } }
                     },
                     y: {
                         grid: { display: false },
-                        ticks: { color: '#d1d5db', font: { size: 12 } }
+                        ticks: { color: '#6b7280', font: { size: 12 } }
                     }
                 },
                 plugins: {
                     legend: { display: false },
                     tooltip: {
-                        backgroundColor: '#1f2937',
+                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                         titleFont: { size: 14, weight: 'bold' },
                         bodyFont: { size: 12 },
                         padding: 10,
@@ .. @@
         <div
-            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
+            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
             onClick={onClose}
             role="dialog"
             aria-modal="true"
             aria-labelledby="benchmark-modal-title"
         >
-            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
-                <header className="p-4 sm:p-6 border-b border-gray-700 flex-shrink-0">
+            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
+                <header className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
                     <div className="flex justify-between items-center">
                         <div className="flex items-center gap-3">
-                            <h2 id="benchmark-modal-title" className="text-lg sm:text-xl font-bold text-cyan-400">{benchmark.type} Benchmark Comparison</h2>
+                            <h2 id="benchmark-modal-title" className="text-lg sm:text-xl font-bold text-purple-600">{benchmark.type} Benchmark Comparison</h2>
                             <button
                                 onClick={() => setIsInfoVisible(!isInfoVisible)}
-                                className="text-gray-400 hover:text-cyan-400 transition-colors"
+                                className="text-gray-400 hover:text-purple-600 transition-colors"
                                 aria-label="Toggle benchmark explanation"
                                 title="What does this benchmark mean?"
                             >
                                 <InfoIcon />
                             </button>
                         </div>
-                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700">&times;</button>
+                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-3xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">&times;</button>
                     </div>
-                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
-                        Comparing components with scores within &plusmn;15% of <span className="font-bold text-gray-200">{benchmark.name}</span> (Score: {new Intl.NumberFormat().format(benchmark.score)}).
+                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
+                        Comparing components with scores within &plusmn;15% of <span className="font-bold text-gray-900">{benchmark.name}</span> (Score: {new Intl.NumberFormat().format(benchmark.score)}).
                     </p>
                     {isInfoVisible && (
-                        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 transition-all duration-300 animate-fade-in-slow">
-                            <h3 className="font-semibold text-gray-200 mb-2">What do these scores mean?</h3>
-                            <p className="text-sm text-gray-400">
+                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 animate-fade-in-slow">
+                            <h3 className="font-semibold text-gray-900 mb-2">What do these scores mean?</h3>
+                            <p className="text-sm text-gray-600">
                                 {benchmark.type === 'CPU' 
                                     ? `CPU benchmarks (like Cinebench or Geekbench) measure a processor's performance on demanding tasks like 3D rendering, video encoding, and complex calculations. A higher score generally means a faster, more capable processor for professional work and multitasking.` 
                                     : `GPU benchmarks (like 3DMark Time Spy) measure a graphics card's ability to render complex 3D graphics, which is vital for gaming, AI, and content creation. A higher score indicates better performance, leading to smoother frame rates and faster processing times.`
@@ .. @@
                     <div className="relative min-h-[400px] sm:min-h-[500px]">
                         {isLoading ? (
-                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
-                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
+                            <div className="absolute inset-0 flex items-center justify-center text-gray-600">
+                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                 <span>Querying AI for real-time benchmark data...</span>
                             </div>
                         ) : error ? (
-                            <div className="absolute inset-0 flex items-center justify-center text-red-400 px-4 text-center">{error}</div>
+                            <div className="absolute inset-0 flex items-center justify-center text-red-600 px-4 text-center">{error}</div>
                         ) : chartData.length > 1 ? (
                             <canvas ref={chartRef}></canvas>
                         ) : (
-                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 px-4 text-center">The AI could not find other benchmarks in this specific performance range (±15%). This can happen for very new or niche components.</div>
+                            <div className="absolute inset-0 flex items-center justify-center text-gray-600 px-4 text-center">The AI could not find other benchmarks in this specific performance range (±15%). This can happen for very new or niche components.</div>
                         )}
                     </div>
                     {chartData.length > 1 && !isLoading && (
-                        <div className="mt-6 border-t border-gray-700 pt-4">
-                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Data Sources</h4>
-                            <ul className="text-xs text-gray-400 space-y-1 max-h-24 overflow-y-auto">
+                        <div className="mt-6 border-t border-gray-200 pt-4">
+                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Data Sources</h4>
+                            <ul className="text-xs text-gray-600 space-y-1 max-h-24 overflow-y-auto">
                                 {chartData.filter(d => d.source && d.source !== 'N/A').map(d => (
                                     <li key={d.name}>
-                                        <span className="font-medium text-gray-300">{d.name}:</span>
-                                        <a href={d.source} target="_blank" rel="noopener noreferrer" className="ml-2 hover:text-cyan-400 underline transition-colors">
+                                        <span className="font-medium text-gray-900">{d.name}:</span>
+                                        <a href={d.source} target="_blank" rel="noopener noreferrer" className="ml-2 hover:text-purple-600 underline transition-colors">
                                             {new URL(d.source).hostname}
                                         </a>
                                     </li>