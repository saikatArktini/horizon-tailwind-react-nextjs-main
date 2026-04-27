import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Roles
  // const adminRole = await prisma.role.upsert({
  //   where: { name: "SUPER_ADMIN" },
  //   update: {},
  //   create: { name: "SUPER_ADMIN" },
  // });

  // const memberRole = await prisma.role.upsert({
  //   where: { name: "MEMBER" },
  //   update: {},
  //   create: { name: "MEMBER" },
  // });

  // // Genders
  // await prisma.gender.createMany({
  //   data: [{ name: "Male" }, { name: "Female" }, { name: "Other" }],
  //   skipDuplicates: true,
  // });

  // // Member Status
  // await prisma.memberStatus.createMany({
  //   data: [{ name: "Active" }, { name: "Inactive" }],
  //   skipDuplicates: true,
  // });

  // Account Types
  // await prisma.accountType.createMany({
  //   data: [
  //     { code: "SAVINGS", name: "Savings Account" },
  //     { code: "CURRENT", name: "Current Account" },
  //     { code: "FD", name: "Fixed Deposit" },
  //     { code: "RD", name: "Recurring Deposit" },
  //     { code: "LOAN", name: "Loan Account" },
  //     { code: "MIS", name: "MIS Account" },
  //   ],
  //   skipDuplicates: true,
  // });

  // // Account Status
  // await prisma.accountStatus.createMany({
  //   data: [
  //     { name: "ACTIVE" },
  //     { name: "CLOSED" },
  //     { name: "BLOCKED" },
  //   ],
  //   skipDuplicates: true,
  // });

  // // Transaction Types
  // await prisma.transactionType.createMany({
  //   data: [
  //     { name: "DEPOSIT" },
  //     { name: "WITHDRAWAL" },
  //     { name: "TRANSFER" },
  //     { name: "INTEREST" },
  //   ],
  //   skipDuplicates: true,
  // });
  const permissionCodes = [
    "VIEW_BRANCH",
    "CREATE_BRANCH",
    "UPDATE_BRANCH",

    "VIEW_MEMBER",
    "CREATE_MEMBER",
    "UPDATE_MEMBER",
    "VERIFY_MEMBER",

    "CREATE_ACCOUNT",
    "VIEW_ACCOUNT",

    "VIEW_DASHBOARD",
  ];
  const ROLE_PERMISSIONS: Record<string, string[]> = {
  "Super-Admin": [
    "VIEW_BRANCH",
    "CREATE_BRANCH",
    "UPDATE_BRANCH",

    "VIEW_MEMBER",
    "CREATE_MEMBER",
    "UPDATE_MEMBER",
    "VERIFY_MEMBER",

    "CREATE_ACCOUNT",
    "VIEW_ACCOUNT",

    "VIEW_DASHBOARD",
  ],

  "Zonal-Admin": [
    "VIEW_BRANCH",
    "UPDATE_BRANCH",

    "VIEW_MEMBER",
    "CREATE_MEMBER",
    "UPDATE_MEMBER",
    "VERIFY_MEMBER",

    "CREATE_ACCOUNT",
    "VIEW_ACCOUNT",

    "VIEW_DASHBOARD",
  ],

  "Branch-Admin": [
    "VIEW_MEMBER",
    "CREATE_MEMBER",
    "UPDATE_MEMBER",
    "VERIFY_MEMBER",

    "CREATE_ACCOUNT",
    "VIEW_ACCOUNT",

    "VIEW_DASHBOARD",
  ],
};


  const permissions = await Promise.all(
    permissionCodes.map((code) =>
      prisma.Permission.upsert({
        where: { code },
        update: {},
        create: { code },
      })
    )
  );

  console.log("✅ Permissions seeded");

 /* =========================
   2️⃣ Create Roles
   ========================= */

const roles = await Promise.all(
  Object.keys(ROLE_PERMISSIONS).map((roleName) =>
    prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    })
  )
);

console.log("✅ Roles seeded");

/* =========================
   3️⃣ Assign Permissions to Roles
   ========================= */

const permissionMap = new Map(
  permissions.map((p) => [p.code, p.id])
);

for (const role of roles) {
  const allowedPermissions = ROLE_PERMISSIONS[role.name];

  for (const permissionCode of allowedPermissions) {
    const permissionId = permissionMap.get(permissionCode);

    if (!permissionId) {
      throw new Error(`Permission not found: ${permissionCode}`);
    }

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: role.id,
          permissionId,
        },
      },
      update: {},
      create: {
        roleId: role.id,
        permissionId,
      },
    });
  }
}

console.log("✅ RolePermissions seeded");

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
