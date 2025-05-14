import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetModule } from './budget/budget.module';
import { PayeeModule } from './payee/payee.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './user/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GoalModule } from './goals/goal.module';
import { TrackerModule } from './tracker/tracker.module';
import { TrackerController } from './tracker/tracker.controller';

/**
 *  MongooseModule.forRoot({
       uri: 'mongodb://admin:admin@localhost:30000',
       dbName: 'data'
    }),
 */
@Module({
  /*
   * these imports are a nestjs feature. it has nothing to do with file imports
   * it's a nestjs feature to link modules together
   */
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }),
    /**
     * I can add this here if I want to access the JwtService globally throughout the entire application
     * todo add this a little later
     */
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { expiresIn: '1h' },
    // }),
    GoalModule,
    BudgetModule,
    PayeeModule,
    UserModule,
    AuthModule,
    TrackerModule,
  ],
  controllers: [TrackerController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard('jwt'),
    // },
  ],
})
export class AppModule {}
