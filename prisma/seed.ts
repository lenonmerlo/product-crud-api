import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = [
    {
      codigoProduto: 'HNK-LT350',
      descricaoProduto: 'Heineken Lata 350ml',
      status: true,
    },
    {
      codigoProduto: 'HNK-LN330',
      descricaoProduto: 'Heineken Long Neck 330ml',
      status: true,
    },
    {
      codigoProduto: 'HNK-GF600',
      descricaoProduto: 'Heineken Garrafa 600ml',
      status: true,
    },
    {
      codigoProduto: 'AMS-LT350',
      descricaoProduto: 'Amstel Lata 350ml',
      status: true,
    },
    {
      codigoProduto: 'AMS-LN600',
      descricaoProduto: 'Amstel Long Neck 600ml',
      status: true,
    },
    {
      codigoProduto: 'KAI-GF600',
      descricaoProduto: 'Kaiser Garrafa 600ml',
      status: true,
    },
    {
      codigoProduto: 'BAV-LT350',
      descricaoProduto: 'Bavaria Lata 350ml',
      status: true,
    },
    {
      codigoProduto: 'SOL-LT350',
      descricaoProduto: 'Sol Lata 350ml',
      status: true,
    },
    {
      codigoProduto: 'EIS-LN355',
      descricaoProduto: 'Eisenbahn Long Neck 355ml',
      status: true,
    },
    {
      codigoProduto: 'LAG-LN355',
      descricaoProduto: 'Lagunitas IPA 355ml',
      status: true,
    },
    {
      codigoProduto: 'ITU-LT350',
      descricaoProduto: 'Itubaina Laranja Lata 350ml',
      status: true,
    },
    {
      codigoProduto: 'GLA-LT350',
      descricaoProduto: 'Glacial Lata 350ml',
      status: false,
    },
    {
      codigoProduto: 'TIG-LN330',
      descricaoProduto: 'Tiger Long Neck 330ml',
      status: false,
    },
    {
      codigoProduto: 'PRY-LT350',
      descricaoProduto: 'Praya Lata 350ml',
      status: false,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { codigoProduto: product.codigoProduto },
      update: {},
      create: product,
    });
  }

  console.log(`Seed concluído: ${products.length} produtos inseridos`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
