import { GnroMenuConfig } from '@gnro/ui/menu';

export const MockMenuItems: GnroMenuConfig = {
  icon: 'ellipsis-v',
  name: 'group0',
  children: [
    {
      title: 'Speakers',
      name: 'group',
      children: [
        {
          title: 'Michael Prentice',
          name: 'person',
          children: [
            {
              title: 'Delight your Organization',
              name: 'star_rate',
              //type: 'checkbox',
            },
          ],
        },
        {
          title: 'Stephen Fluin',
          name: 'person',
          children: [
            {
              title: "What's up with the Web?",
              name: 'star_rate',
              keepOpen: true,
            },
          ],
        },
        {
          title: 'Mike Brocchi',
          name: 'person',
          children: [
            {
              title: 'My ally, the CLI',
              name: 'star_rate',
            },
            {
              title: 'Become an Angular Tailor',
              name: 'star_rate',
            },
          ],
        },
        {
          title: 'James Brocchi',
          name: 'person',
        },
      ],
    },
    {
      title: 'Sessions',
      name: 'speaker_notes',
      children: [
        {
          title: 'Delight your Organization',
          name: 'star_rate',
        },
        {
          title: "What's up with the Web?",
          name: 'star_rate',
        },
        {
          title: 'My ally, the CLI',
          name: 'star_rate',
        },
        {
          title: 'Become an Angular Tailor',
          name: 'star_rate',
        },
      ],
    },
    {
      title: 'Feedback',
      name: 'feedback',
    },
  ],
};
