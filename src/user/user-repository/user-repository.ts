import { Connection } from '../connection/connection';

export class UserRepository {
  connection: Connection;

  save() {
    console.log(`Saving user to ${this.connection.getName()}`);
  }
}

export function createUserRepository(connection: Connection): UserRepository {
  const userRepository = new UserRepository();
  userRepository.connection = connection;
  return userRepository;
}
