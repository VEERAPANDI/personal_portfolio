import React from 'react';
import ContentManager from './ContentManager';
import ProjectManagerWithImagePicker from './ProjectManager';

export { ProjectManagerWithImagePicker as ProjectManager };

export const ExperienceManager = () => (
    <ContentManager
        title="Experience"
        endpoint="experience"
        fields={[
            { name: 'workingYear', label: 'Working Year (Ex: 2021-2023)' },
            { name: 'company', label: 'Company Name' },
            { name: 'companyWebsite', label: 'Company Website' },
            { name: 'role', label: 'Role' },
            { name: 'startDate', label: 'Start Date', type: 'date' },
            { name: 'endDate', label: 'End Date (Optional)', type: 'date' },
            { name: 'description', label: 'Description', type: 'textarea' }
        ]}
    />
);

export const SkillManager = () => (
    <ContentManager
        title="Skills"
        endpoint="skills"
        fields={[
            { name: 'name', label: 'Skill Name' },
            { name: 'level', label: 'Level (Beginner, Intermediate, Advanced)' },
            { name: 'icon', label: 'Icon Name or URL' }
        ]}
    />
);

import BlogManagerWithImagePicker from './BlogManager';

export { BlogManagerWithImagePicker as BlogManager };
