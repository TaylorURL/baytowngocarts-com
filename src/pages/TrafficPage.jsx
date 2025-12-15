import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Activity, ArrowLeft, BarChart3, Clock, Globe, Monitor, MousePointer, TrendingUp, Users} from 'lucide-react';
import {useAdmin} from '../hooks/useAdmin';
import {getTrafficStats} from '../hooks/useTraffic';

export default function TrafficPage() {
    const navigate = useNavigate();
    const {isStaff, loading: staffLoading} = useAdmin();
    const [traffic, setTraffic] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('today');

    useEffect(() => {
        if (!staffLoading && !isStaff) {
            navigate('/');
        }
    }, [isStaff, staffLoading, navigate]);

    useEffect(() => {
        const fetchTraffic = async () => {
            setLoading(true);
            const data = await getTrafficStats(timeRange);
            setTraffic(data);
            setLoading(false);
        };
        fetchTraffic();
    }, [timeRange]);

    const getPageViewsByPath = () => {
        const counts = {};
        traffic.forEach(view => {
            const path = view.page_path || 'Unknown';
            counts[path] = (counts[path] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
    };

    const getDeviceBreakdown = () => {
        let mobile = 0;
        let desktop = 0;
        let tablet = 0;

        traffic.forEach(view => {
            const ua = (view.user_agent || '').toLowerCase();
            if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
                mobile++;
            } else if (ua.includes('ipad') || ua.includes('tablet')) {
                tablet++;
            } else {
                desktop++;
            }
        });

        return {mobile, desktop, tablet};
    };

    const getReferrerBreakdown = () => {
        const counts = {};
        traffic.forEach(view => {
            let source = 'Direct';
            if (view.referrer) {
                try {
                    const url = new URL(view.referrer);
                    source = url.hostname;
                } catch {
                    source = view.referrer;
                }
            }
            counts[source] = (counts[source] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    };

    const getHourlyBreakdown = () => {
        const hours = Array(24).fill(0);
        traffic.forEach(view => {
            const hour = new Date(view.timestamp).getHours();
            hours[hour]++;
        });
        return hours;
    };

    if (staffLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-navy-900 via-red-900 to-navy-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!isStaff) {
        return null;
    }

    const pageViews = getPageViewsByPath();
    const devices = getDeviceBreakdown();
    const referrers = getReferrerBreakdown();
    const hourlyData = getHourlyBreakdown();
    const maxHourly = Math.max(...hourlyData, 1);

    return (
        <div className="w-full -mt-20">
            <section className="relative bg-navy-900 overflow-hidden pt-32 pb-12">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-navy-900"/>
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5"/>
                        Back
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="inline-block mb-4 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold tracking-wider">
                                ANALYTICS
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                                Site Traffic
                            </h1>
                            <p className="text-gray-300">
                                Monitor visitor activity and page performance
                            </p>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {['today', 'week', 'month', 'quarter', 'year'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                        timeRange === range
                                            ? 'bg-red-600 text-white'
                                            : 'bg-navy-800 text-gray-300 hover:bg-navy-700'
                                    }`}
                                >
                                    {range.charAt(0).toUpperCase() + range.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-8 bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading traffic data...</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-red-100 p-3 rounded-xl">
                                            <Users className="h-6 w-6 text-red-600"/>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Views</p>
                                            <p className="text-3xl font-bold text-navy-900">{traffic.length}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-100 p-3 rounded-xl">
                                            <Monitor className="h-6 w-6 text-blue-600"/>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Desktop</p>
                                            <p className="text-3xl font-bold text-navy-900">{devices.desktop}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-green-100 p-3 rounded-xl">
                                            <Activity className="h-6 w-6 text-green-600"/>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Mobile</p>
                                            <p className="text-3xl font-bold text-navy-900">{devices.mobile}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-purple-100 p-3 rounded-xl">
                                            <BarChart3 className="h-6 w-6 text-purple-600"/>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Unique Pages</p>
                                            <p className="text-3xl font-bold text-navy-900">{pageViews.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                                    <h3 className="text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
                                        <MousePointer className="h-5 w-5 text-red-600"/>
                                        Top Pages
                                    </h3>
                                    {pageViews.length > 0 ? (
                                        <div className="space-y-3">
                                            {pageViews.map(([path, count], idx) => (
                                                <div key={path} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}</span>
                                                        <span className="text-gray-700 font-medium">{path}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-red-600 h-2 rounded-full"
                                                                style={{width: `${(count / traffic.length) * 100}%`}}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-bold text-navy-900 w-12 text-right">{count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No page views recorded</p>
                                    )}
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                                    <h3 className="text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-red-600"/>
                                        Traffic Sources
                                    </h3>
                                    {referrers.length > 0 ? (
                                        <div className="space-y-3">
                                            {referrers.map(([source, count], idx) => (
                                                <div key={source} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}</span>
                                                        <span className="text-gray-700 font-medium truncate max-w-[200px]">{source}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{width: `${(count / traffic.length) * 100}%`}}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-bold text-navy-900 w-12 text-right">{count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No referrer data</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 mb-8">
                                <h3 className="text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-red-600"/>
                                    Traffic by Hour
                                </h3>
                                <div className="flex items-end gap-1 h-40">
                                    {hourlyData.map((count, hour) => (
                                        <div key={hour} className="flex-1 flex flex-col items-center">
                                            <div
                                                className="w-full bg-red-600 rounded-t transition-all hover:bg-red-500"
                                                style={{height: `${(count / maxHourly) * 100}%`, minHeight: count > 0 ? '4px' : '0'}}
                                                title={`${hour}:00 - ${count} views`}
                                            />
                                            {hour % 3 === 0 && (
                                                <span className="text-xs text-gray-500 mt-1">{hour}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                                <h3 className="text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-red-600"/>
                                    Recent Activity
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200">
                                                <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Time</th>
                                                <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Page</th>
                                                <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Device</th>
                                                <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Source</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {traffic.slice(0, 20).map((view, idx) => {
                                                const ua = (view.user_agent || '').toLowerCase();
                                                let device = 'Desktop';
                                                if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
                                                    device = 'Mobile';
                                                } else if (ua.includes('ipad') || ua.includes('tablet')) {
                                                    device = 'Tablet';
                                                }

                                                let source = 'Direct';
                                                if (view.referrer) {
                                                    try {
                                                        source = new URL(view.referrer).hostname;
                                                    } catch {
                                                        source = view.referrer;
                                                    }
                                                }

                                                return (
                                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="py-3 px-4 text-sm text-gray-600">
                                                            {new Date(view.timestamp).toLocaleString()}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm font-medium text-navy-900">
                                                            {view.page_path}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                                                device === 'Mobile' ? 'bg-green-100 text-green-700' :
                                                                device === 'Tablet' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-blue-100 text-blue-700'
                                                            }`}>
                                                                {device}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-[150px]">
                                                            {source}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    {traffic.length === 0 && (
                                        <p className="text-gray-500 text-center py-8">No traffic recorded for this period</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
