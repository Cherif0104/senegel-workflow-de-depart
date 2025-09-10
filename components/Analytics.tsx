import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

interface AnalyticsProps {
    setView: (view: string) => void;
}

const ChartCard: React.FC<{ title: string; children: React.ReactNode; viewMoreLink?: () => void; viewMoreText?: string }> = ({ title, children, viewMoreLink, viewMoreText }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
        <div>{children}</div>
        {viewMoreLink && viewMoreText && (
            <div className="mt-4 text-right">
                <button onClick={viewMoreLink} className="text-sm font-medium text-emerald-600 hover:text-emerald-800">
                    {viewMoreText} &rarr;
                </button>
            </div>
        )}
    </div>
);

const BarChartPlaceholder: React.FC = () => (
    <div className="flex items-end h-48 space-x-4">
        <div className="w-full bg-emerald-200 rounded-t-lg" style={{height: '40%'}} title="Q1"></div>
        <div className="w-full bg-emerald-200 rounded-t-lg" style={{height: '60%'}} title="Q2"></div>
        <div className="w-full bg-emerald-200 rounded-t-lg" style={{height: '55%'}} title="Q3"></div>
        <div className="w-full bg-emerald-300 rounded-t-lg" style={{height: '80%'}} title="Q4"></div>
    </div>
);

const Analytics: React.FC<AnalyticsProps> = ({ setView }) => {
    const { t } = useLocalization();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">{t('platform_analytics')}</h1>
            <p className="mt-1 text-gray-600">{t('platform_analytics_subtitle')}</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <ChartCard title={t('user_growth')}>
                    <BarChartPlaceholder />
                </ChartCard>
                <ChartCard title={t('enrollment_trends')}>
                    <BarChartPlaceholder />
                </ChartCard>
                <ChartCard 
                    title={t('talent_analytics')}
                    viewMoreLink={() => setView('talent_analytics')}
                    viewMoreText={t('view_talent_analytics')}
                >
                    <div className="text-center py-8">
                         <i className="fas fa-user-astronaut text-5xl text-emerald-500"></i>
                         <p className="mt-4 text-gray-600">{t('talent_analytics_subtitle')}</p>
                    </div>
                </ChartCard>
                 <ChartCard title={t('job_application_funnel')}>
                     <div className="text-center py-8 text-gray-400">
                         <i className="fas fa-filter text-5xl"></i>
                         <p className="mt-4">Funnel Chart Placeholder</p>
                    </div>
                </ChartCard>
            </div>
        </div>
    );
};

export default Analytics;
