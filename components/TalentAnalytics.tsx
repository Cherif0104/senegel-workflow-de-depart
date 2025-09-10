
import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

interface TalentAnalyticsProps {
    setView: (view: string) => void;
}

const SkillList: React.FC<{title: string, skills: string[]}> = ({title, skills}) => (
    <div>
        <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
        <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
                <span key={skill} className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                    {skill}
                </span>
            ))}
        </div>
    </div>
);


const TalentAnalytics: React.FC<TalentAnalyticsProps> = ({ setView }) => {
    const { t } = useLocalization();

    const demandedSkills = ["Project Management", "UI/UX", "Data Analysis", "Community Management", "Node.js"];
    const availableSkills = ["Digital Marketing", "Project Management", "Graphic Design", "Content Creation", "Agile Methodologies"];

    return (
        <div>
            <button onClick={() => setView('analytics')} className="flex items-center text-emerald-600 font-semibold mb-6 hover:text-emerald-800">
                <i className="fas fa-arrow-left mr-2"></i>
                {t('back_to_analytics')}
            </button>

            <h1 className="text-3xl font-bold text-gray-800">{t('talent_analytics')}</h1>
            <p className="mt-1 text-gray-600">{t('talent_analytics_subtitle')}</p>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Skill Gap Analysis */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{t('skill_gap_analysis')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SkillList title={t('most_demanded_skills')} skills={demandedSkills} />
                        <SkillList title={t('available_skills')} skills={availableSkills} />
                    </div>
                </div>

                {/* Talent Forecasting */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{t('talent_forecasting')}</h3>
                    <p className="text-sm text-gray-500 mb-6">{t('talent_forecasting_subtitle')}</p>
                    
                    <div className="p-4 border-dashed border-2 border-gray-300 rounded-lg text-center">
                         <i className="fas fa-magic text-4xl text-emerald-400 mb-4"></i>
                         <p className="text-gray-600 mb-4">This is a placeholder for the AI-powered forecasting tool.</p>
                         <button onClick={() => alert('This feature is coming soon!')} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700">
                            {t('forecast_needs')}
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TalentAnalytics;