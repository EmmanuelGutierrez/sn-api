import { SetMetadata } from '@nestjs/common';

export const IS_SUBSCRIPTION = 'isSubscription';

export const IsSubscription = () => SetMetadata(IS_SUBSCRIPTION, true);
