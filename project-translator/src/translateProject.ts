import { createSyncProjects } from '@commercetools/sync-actions';
import { getProject, isDryRun, updateProject } from '@commercetools-demo/shared-code';
import type { ProjectUpdateAction } from '@commercetools/platform-sdk';

const syncTypes = createSyncProjects();

export const projectTranslation = async () => {
  const project = await getProject();
  const before = {
    languages: project.languages,
    currencies: project.currencies,
    countries: project.countries,
  };
  const nextDraft = {
    ...before,
    languages: JSON.parse(process.env.LOCALES || '').map((entry: string) => entry.replaceAll('_', '-')),
    currencies: JSON.parse(process.env.CURRENCIES || ''),
    countries: JSON.parse(process.env.COUNTRIES || ''),
  };

  const actions = syncTypes.buildActions(nextDraft, before);
  if (actions.length > 0) {
    if (isDryRun()) {
      console.log('On project:');
      actions.forEach((action) => console.log(action));
    } else {
      await updateProject(project.version, actions as Array<ProjectUpdateAction>).catch((error) => {
        console.log(error.body);
      });
    }
  }
};

projectTranslation().then(() => process.exit());
