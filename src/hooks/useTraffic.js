import {useEffect} from 'react';
import {supabase} from '../lib/supabase';

export const logPageView = async (pathname) => {
    try {
        const userAgent = navigator.userAgent;
        const referrer = document.referrer || null;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;

        await supabase.from('site_traffic').insert({
            page_path: pathname,
            user_agent: userAgent,
            referrer: referrer,
            screen_width: screenWidth,
            screen_height: screenHeight,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error logging page view:', error);
    }
};

export const useTrafficLogger = (pathname) => {
    useEffect(() => {
        logPageView(pathname);
    }, [pathname]);
};

export const getTrafficStats = async (timeRange = 'today') => {
    try {
        let startDate;
        const now = new Date();

        switch (timeRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'quarter':
                const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
                startDate = new Date(now.getFullYear(), quarterMonth, 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }

        const {data, error} = await supabase
            .from('site_traffic')
            .select('*')
            .gte('timestamp', startDate.toISOString())
            .order('timestamp', {ascending: false});

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error fetching traffic stats:', error);
        return [];
    }
};
