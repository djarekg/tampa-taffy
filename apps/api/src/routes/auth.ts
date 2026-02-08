import { getUser, isAuthenticated, signin, signout } from '#app/controllers/auth.ts';
import Router from '@koa/router';

const router = new Router();

router.get('/auth/users/:username', getUser);
router.post('/auth/signin', signin);
router.post('/auth/signout', signout);
router.get('/auth/authenticated', isAuthenticated);

export default router;
