# Sistema de Gerenciamento de Documentos

## Descrição

O sistema de gerenciamento de documentos permite armazenar, validar e gerenciar arquivos de forma segura no sistema, associando-os a usuários.

## Estrutura

### Tabela Document

```prisma
model Document {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  mimeType  MimeType
  data      Bytes
  createdAt DateTime @default(now())
  deletedAt DateTime?
}

enum MimeType {
  APPLICATION_PDF
}
```

### Serviços Disponíveis

#### `getDocuments(filter?: Prisma.DocumentFindManyArgs): Promise<Result<Document[]>>`

Busca documentos com filtros opcionais. Retorna apenas documentos não excluídos.

```typescript
import { getDocuments } from "@/services";

// Buscar todos os documentos
const allDocuments = await getDocuments();

// Buscar documentos de um usuário específico
const userDocuments = await getDocuments({
  where: { userId: "user123" },
  include: { user: true },
});

// Buscar com paginação
const paginatedDocuments = await getDocuments({
  take: 10,
  skip: 0,
  orderBy: { createdAt: "desc" },
});
```

#### `getDocumentById(documentId: string, filter?: Prisma.DocumentDefaultArgs): Promise<Result<Document>>`

Busca um documento específico pelo ID.

```typescript
import { getDocumentById } from "@/services";

// Buscar documento por ID
const document = await getDocumentById("doc123");

// Buscar documento com dados do usuário
const documentWithUser = await getDocumentById("doc123", {
  include: { user: true },
});
```

#### `createDocument(input: CreateDocumentInput): Promise<Result<Document>>`

Cria um novo documento com validação automática de PDF.

```typescript
import { createDocument, MimeType } from "@/services";

const documentData = {
  userId: "user123",
  name: "relatorio.pdf",
  mimeType: MimeType.APPLICATION_PDF,
  data: pdfBuffer, // Buffer com os dados do PDF
};

const result = await createDocument(documentData);
if (result.success) {
  console.log("Documento criado:", result.data);
} else {
  console.error("Erro:", result.error?.errors);
}
```

#### `deleteDocument(documentId: string): Promise<Result<Document>>`

Exclui um documento (soft delete - marca como excluído).

```typescript
import { deleteDocument } from "@/services";

const result = await deleteDocument("doc123");
if (result.success) {
  console.log("Documento excluído:", result.data);
} else {
  console.error("Erro:", result.error?.errors);
}
```

### Validação de PDF

O sistema inclui um validador robusto para arquivos PDF que verifica:

- ✅ Assinatura do arquivo (%PDF no início dos bytes)
- ✅ MIME type correto (application/pdf)
- ✅ Extensão do arquivo (.pdf)
- ✅ Arquivo não vazio

```typescript
import { validatePdf, type FileValidationInput } from "@/infra/documents";

const fileInput: FileValidationInput = {
  data: pdfBuffer,
  mimeType: "application/pdf",
  filename: "documento.pdf",
};

const validation = validatePdf(fileInput);
if (validation.isValid) {
  console.log("PDF válido!");
} else {
  console.error("Erros de validação:", validation.errors);
}
```

## Exemplos de Uso

### Upload de Documento via API

```typescript
// api/documents/route.ts
import { createDocument } from "@/services";
import { getUserIdAuthenticated } from "@/utils/auth";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 },
      );
    }

    const userId = await getUserIdAuthenticated();
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await createDocument({
      userId,
      name: file.name,
      mimeType: "APPLICATION_PDF",
      data: buffer,
    });

    if (result.success) {
      return Response.json(result.data);
    } else {
      return Response.json({ error: result.error }, { status: result.code });
    }
  } catch (error) {
    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
```

### Listar Documentos do Usuário

```typescript
// components/DocumentList.tsx
import { useEffect, useState } from 'react';
import { getDocuments } from '@/services';

interface Document {
  id: string;
  name: string;
  createdAt: Date;
  mimeType: string;
}

export function DocumentList({ userId }: { userId: string }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      const result = await getDocuments({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (result.success) {
        setDocuments(result.data);
      }
      setLoading(false);
    }

    loadDocuments();
  }, [userId]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Meus Documentos</h2>
      {documents.map((doc) => (
        <div key={doc.id} className="document-item">
          <span>{doc.name}</span>
          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
}
```

## Segurança

- ✅ Validação rigorosa de tipos de arquivo
- ✅ Verificação de assinatura de arquivo
- ✅ Associação obrigatória com usuário
- ✅ Soft delete para auditoria
- ✅ Cascade delete quando usuário é removido

## Limitações Atuais

- Suporte apenas para PDFs (MimeType.APPLICATION_PDF)
- Armazenamento em banco de dados (considerar storage externo para arquivos grandes)
- Sem limitação de tamanho de arquivo (implementar conforme necessário)

## Próximos Passos

1. Adicionar suporte para outros tipos de arquivo
2. Implementar storage externo (AWS S3, etc.)
3. Adicionar compressão de arquivos
4. Implementar versionamento de documentos
5. Adicionar metadata adicional (tags, categorias, etc.)
