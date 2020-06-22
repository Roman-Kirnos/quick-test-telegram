const I18n = require('telegraf-i18n');
const path = require('path');

const i18n = new I18n({
  locales: ['uk'],
  directory: path.join(process.cwd(), 'src/localization'),
  defaultLanguage: 'uk',
  currentLocale: 'uk', // You should change this if 'defaultLanguage' isn't 'uk'
  sessionName: 'session',
  useSession: true,
  templateData: {
    pluralize: I18n.pluralize,
    uppercase: value => value.toUpperCase(),
  },
});

module.exports = i18n;
