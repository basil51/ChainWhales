import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        createdAt: Date;
        email: string;
        plan: import("@prisma/client").$Enums.Plan;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        createdAt: Date;
        email: string;
        plan: import("@prisma/client").$Enums.Plan;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
