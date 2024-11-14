import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetModule } from './budget/budget.module';
import { PayeeModule } from './payee/payee.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './user/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

/**
 *  MongooseModule.forRoot({
       uri: 'mongodb://admin:admin@localhost:30000',
       dbName: 'data'
    }),
 */
@Module({
  /*
   * imports is a nestjs feature. it has nothing to do with file imports
   * it's a nestjs feature to link modules together
   */
  imports: [
    MongooseModule.forRoot(
      'mongodb://admin:admin@localhost:27017/budget-tracker',
      { dbName: 'budget-tracker' },
    ),
    /**
     * I can add this here if I want to access the JwtService globally throughout the entire application     
     * 
     */
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    BudgetModule,
    PayeeModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard('jwt')
  }],
})
export class AppModule {}
