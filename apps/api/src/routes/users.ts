import { getUser, getUsers } from '#app/controllers/users.ts';
import Router from '@koa/router';

const router = new Router();

router.get('/users/:id', getUser);
router.get('/users', getUsers);
// router.post('/users/:id/active', updateUserActive);
// router.post('/users/:id', updateUser);
// router.put('/users', createUser);
// router.delete('/users/:id', deleteUser);

export default router;
