import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
  
  return NextResponse.json(users, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  const { email, name, password, role } = await request.json();
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: role || "user"
    }
  });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  const { id, email, name, role } = await request.json();

  const user = await prisma.user.update({
    where: { id },
    data: {
      email,
      name,
      role
    }
  });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  const { id } = await request.json();

  await prisma.user.delete({
    where: { id }
  });

  return NextResponse.json({ success: true }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}