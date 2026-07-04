// @ts-nocheck
import { NextResponse } from "next/server";
import { z } from "zod";

const items: { id: number; name: string }[] = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
];

const itemCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
});

const itemUpdateSchema = itemCreateSchema.extend({
  id: z.number().int().positive(),
});

const itemDeleteSchema = z.object({
  id: z.number().int().positive(),
});

const requireApiSecret = (req: Request) => {
  if (!process.env.API_SECRET) {
    return NextResponse.json({ success: false, message: "API_SECRET is not configured" }, { status: 500 });
  }

  const token = req.headers.get("authorization")?.replace(/^Bearer\\s+/i, "");

  if (token !== process.env.API_SECRET) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  return null;
};

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "Items fetched successfully",
      data: items,
    },
    { status: 200 }
  );
}

export async function POST(req: Request) {
  try {
    const authError = requireApiSecret(req);
    if (authError) return authError;

    const parsed = itemCreateSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
    }

    const newItem = { id: items.length + 1, name: parsed.data.name };
    items.push(newItem);

    return NextResponse.json(
      {
        success: true,
        message: "Item added successfully",
        data: newItem,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const authError = requireApiSecret(req);
    if (authError) return authError;

    const parsed = itemUpdateSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
    }

    const existingItem = items.find((item) => item.id === parsed.data.id);

    if (!existingItem) {
      return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
    }

    existingItem.name = parsed.data.name;

    return NextResponse.json(
      {
        success: true,
        message: "Item updated successfully",
        data: existingItem,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authError = requireApiSecret(req);
    if (authError) return authError;

    const parsed = itemDeleteSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
    }

    const itemIndex = items.findIndex((item) => item.id === parsed.data.id);

    if (itemIndex === -1) {
      return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
    }

    const deletedItem = items.splice(itemIndex, 1);

    return NextResponse.json(
      {
        success: true,
        message: "Item deleted successfully",
        data: deletedItem[0],
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
  }
}
