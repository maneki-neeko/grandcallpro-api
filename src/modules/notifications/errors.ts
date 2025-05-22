import { NotificationMessages } from '../notifications/messages';
import { HttpException, HttpStatus } from '@nestjs/common';

export function throwNotificationNotFound() {
  throw new HttpException(NotificationMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
}

export function throwNotificationUnauthorized() {
  throw new HttpException(NotificationMessages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
}

export function throwNotificationForbidden() {
  throw new HttpException(NotificationMessages.FORBIDDEN, HttpStatus.FORBIDDEN);
}

export function throwNotificationAlreadyExists() {
  throw new HttpException(NotificationMessages.ALREADY_EXISTS, HttpStatus.CONFLICT);
}
