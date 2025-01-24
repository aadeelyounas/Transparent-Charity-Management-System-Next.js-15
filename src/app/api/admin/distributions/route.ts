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

  const distributions = await prisma.distribution.findMany();
  return NextResponse.json(distributions, {
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

  const { beneficiary, amount, purpose } = await request.json();

  const distribution = await prisma.distribution.create({
    data: {
      beneficiary,
      amount,
      purpose,
    },
  });

  // Send notification email
  await sendEmail(
    "admin@serighanial.org",
    "New Distribution Created",
    `<p>A new distribution of $${amount} to ${beneficiary} for ${purpose} has been created.</p>`
  );

  return NextResponse.json(distribution, {
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

  const { id, beneficiary, amount, purpose } = await request.json();

  const distribution = await prisma.distribution.update({
    where: { id },
    data: {
      beneficiary,
      amount,
      purpose
    }
  });

  return NextResponse.json(distribution, {
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

  await prisma.distribution.delete({
    where: { id }
  });

  return NextResponse.json({ success: true }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}