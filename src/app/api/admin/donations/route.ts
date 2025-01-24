import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/prisma";
import { sendEmail } from "@/lib/email";

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

  const donations = await prisma.donation.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(donations, {
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

  const { userId, amount, method, transactionId } = await request.json();

  const donation = await prisma.donation.create({
    data: {
      userId,
      amount,
      method,
      transactionId,
    },
  });

  // Send receipt email
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user) {
    await sendEmail(
      user.email,
      "Donation Receipt",
      `<p>Thank you for your donation of $${amount}.</p>`
    );
  }

  return NextResponse.json(donation, {
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

  const { id, amount, method, transactionId } = await request.json();

  const donation = await prisma.donation.update({
    where: { id },
    data: {
      amount,
      method,
      transactionId
    }
  });

  return NextResponse.json(donation, {
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

  await prisma.donation.delete({
    where: { id }
  });

  return NextResponse.json({ success: true }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}