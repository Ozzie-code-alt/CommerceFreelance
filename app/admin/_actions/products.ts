'use server';

import db from '@/app/db/db';
import { z } from 'zod';
import fs from 'fs/promises';
import { redirect } from 'next/navigation';

const fileSchema = z.instanceof(File, { message: 'Required File' });
const imageSchema = fileSchema.refine((file) => file.size === 0 || file.type.startsWith('image/')); // if fi
const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  priceInCents: z.coerce.number().int().min(1), //coarce converts it to a number first
  file: fileSchema.refine((file) => file.size > 0, 'Reqiured'),
  image: imageSchema.refine((file) => file.size > 0, 'Reqiured') // this checks file size
});
export async function addProduct(formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success == false) {
    return result.error.formErrors.fieldErrors;
  }

  console.log(result);
  const data = result.data;
  console.log(data);
  await fs.mkdir('products', { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  await fs.mkdir('public/products', { recursive: true });
  const imagePath = `products/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));

  console.log(filePath);
  console.log(imagePath);
  await db.product.create({
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath
    }
  });

  redirect('/admin/products');
}
