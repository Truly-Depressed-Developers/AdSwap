import { router } from './init';
import { adspaceRouter } from './routers/adspaceRouter';
import { businessRouter } from './routers/businessRouter';
import { chatRouter } from './routers/chatRouter';
import { exampleRouter } from './routers/example';
import { messageRouter } from './routers/messageRouter';
import { tagRouter } from './routers/tagRouter';
import { userRouter } from './routers/userRouter';

export const appRouter = router({
  example: exampleRouter,
  adspace: adspaceRouter,
  business: businessRouter,
  chat: chatRouter,
  message: messageRouter,
  tag: tagRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
