import { App } from 'vue';

import { directiveLoading } from '@/directives/loading';

export default function registerDirectives(app: App) {
  app.directive('loading', directiveLoading);
}
