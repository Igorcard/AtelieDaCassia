-- CreateTable
CREATE TABLE "usersroles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "usersroles_pkey" PRIMARY KEY ("id")
);

INSERT INTO usersroles (name) VALUES ('client'), ('admin'), ('manager');
