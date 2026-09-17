import { PrismaClient, Priority, Role, TaskStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.taskComment.deleteMany();
  await prisma.taskStatusHistory.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  const [software, systems, network] = await Promise.all([
    prisma.department.create({ data: { name: 'Программ хангамж', description: 'Дотоод систем болон хөгжүүлэлт' } }),
    prisma.department.create({ data: { name: 'Системийн алба', description: 'Сервер, дэд бүтцийн найдвартай ажиллагаа' } }),
    prisma.department.create({ data: { name: 'Сүлжээний алба', description: 'Сүлжээ, холбоо ба аюулгүй байдал' } }),
  ]);

  const passwordHash = await bcrypt.hash('Demo123!', 12);
  const admin = await prisma.user.create({ data: { fullName: 'Бат-Эрдэнэ Ганболд', email: 'admin@ajil.mn', passwordHash, role: Role.super_admin, departmentId: software.id } });
  const manager = await prisma.user.create({ data: { fullName: 'Мөнхзул Төгөлдөр', email: 'manager@ajil.mn', passwordHash, role: Role.manager, departmentId: software.id } });
  const employee = await prisma.user.create({ data: { fullName: 'Анударь Энхболд', email: 'employee@ajil.mn', passwordHash, role: Role.employee, departmentId: software.id } });
  const developer = await prisma.user.create({ data: { fullName: 'Тэмүүлэн Амар', email: 'temuulen@ajil.mn', passwordHash, role: Role.employee, departmentId: software.id } });
  const sysManager = await prisma.user.create({ data: { fullName: 'Саруул Бат', email: 'saruul@ajil.mn', passwordHash, role: Role.manager, departmentId: systems.id } });
  const sysEmployee = await prisma.user.create({ data: { fullName: 'Номин Дорж', email: 'nomin@ajil.mn', passwordHash, role: Role.employee, departmentId: systems.id } });
  const date = (offset) => { const d = new Date(); d.setDate(d.getDate() + offset); return d; };
  const samples = [
    { title: 'Нэвтрэх хэсгийн аюулгүй байдлыг сайжруулах', description: 'JWT refresh token болон rate-limit нэвтрүүлж, тестийн тайлан хавсаргах.', departmentId: software.id, assigneeId: employee.id, createdById: manager.id, priority: Priority.urgent, status: TaskStatus.in_progress, dueDate: date(1) },
    { title: 'ERP тайлангийн модуль шинэчлэх', description: 'Сарын тайлангийн шүүлтүүр болон Excel экспорт нэмэх.', departmentId: software.id, assigneeId: developer.id, createdById: manager.id, priority: Priority.normal, status: TaskStatus.submitted, dueDate: date(0), submittedAt: new Date() },
    { title: 'Мобайл харагдацын UI засвар', description: 'Dashboard болон ажлын жагсаалтыг 360px дэлгэцэд тохируулах.', departmentId: software.id, assigneeId: employee.id, createdById: manager.id, priority: Priority.normal, status: TaskStatus.todo, dueDate: date(4) },
    { title: 'API баримтжуулалт шинэчлэх', description: 'OpenAPI schema болон endpoint жишээнүүдийг шинэчлэх.', departmentId: software.id, assigneeId: developer.id, createdById: manager.id, priority: Priority.low, status: TaskStatus.approved, dueDate: date(-2), reviewedAt: date(-1), reviewedById: manager.id },
    { title: 'Нөөцлөлтийн бодлого шалгах', description: 'Өдөр тутмын backup сэргээх туршилт хийж протокол хөтлөх.', departmentId: systems.id, assigneeId: sysEmployee.id, createdById: sysManager.id, priority: Priority.urgent, status: TaskStatus.todo, dueDate: date(-1) },
    { title: 'Monitoring alert тохируулах', description: 'CPU болон дискний alert босго, сувгийг шинэчлэх.', departmentId: systems.id, assigneeId: sysEmployee.id, createdById: sysManager.id, priority: Priority.normal, status: TaskStatus.rejected, dueDate: date(3), rejectionReason: 'Alert-ийн босго хэт өндөр байна. Дахин тохируулна уу.', reviewedAt: new Date(), reviewedById: sysManager.id },
    { title: 'Сүлжээний үндсэн төхөөрөмжийн аудит', description: 'Firmware хувилбар болон тохиргооны backup-ийг шалгах.', departmentId: network.id, assigneeId: null, createdById: admin.id, priority: Priority.normal, status: TaskStatus.todo, dueDate: date(6) },
  ];

  for (const item of samples) {
    const task = await prisma.task.create({ data: item });
    await prisma.taskStatusHistory.create({ data: { taskId: task.id, fromStatus: null, toStatus: TaskStatus.todo, changedById: item.createdById, comment: 'Ажил үүсгэв' } });
    if (item.status !== TaskStatus.todo) await prisma.taskStatusHistory.create({ data: { taskId: task.id, fromStatus: TaskStatus.todo, toStatus: item.status, changedById: item.assigneeId ?? item.createdById, comment: item.status === TaskStatus.rejected ? item.rejectionReason : 'Төлөв шинэчлэв' } });
  }
  console.log('Seed completed. Demo password: Demo123!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
