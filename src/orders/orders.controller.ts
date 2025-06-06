import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { OrdersService } from './orders.service';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayloadType } from 'src/utils/types';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { UpdateOrderStatusDto } from './dtos/update-status.dto';
import { UpdateOrderProductsDto } from './dtos/update-products.dto';

@Controller('api/orders')
export class OrderController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles(UserType.ADMIN, UserType.NORMAL_USER) // Allow both ADMIN and USER types to get orders
  @UseGuards(AuthRolesGuard) // You can add your authentication guard here if needed
  public async getOrders(
    @Query() getOrdersQuery: GetOrdersDto,
    @CurrentUser() user: JWTPayloadType,
  ) {
    return await this.ordersService.getFilteredOrders(getOrdersQuery, user);
  }

  @Post()
  @Roles(UserType.NORMAL_USER) // Allow only USER type to create orders
  @UseGuards(AuthRolesGuard) // Ensure the user is authenticated
  public async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: JWTPayloadType,
  ) {
    return await this.ordersService.createOrder(createOrderDto, user.id);
  }

  @Get(':id')
  @Roles(UserType.ADMIN, UserType.NORMAL_USER) // Allow only ADMIN type to get all orders
  @UseGuards(AuthRolesGuard) // Ensure the user is authenticated
  public async getOrderById(
    @Param('id') id: string,
    @CurrentUser() user: JWTPayloadType,
  ) {
    return await this.ordersService.getOrderById(id, user);
  }

  @Patch(':id')
  @Roles(UserType.ADMIN) // Allow only ADMIN type to update orders
  @UseGuards(AuthRolesGuard) // Ensure the user is authenticated
  public async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderStatusDto,
  ) {
    return await this.ordersService.updateOrderStatusById(id, updateOrderDto);
  }

  @Patch(':id/order-products')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async updateOrderProductsById(
    @Body() orderProducts: UpdateOrderProductsDto,
    @Param('id') orderId: string,
  ) {
    return await this.ordersService.updateOrderProductsById(
      orderProducts,
      orderId,
    );
  }
}
