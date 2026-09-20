require('dotenv/config');
const {test}=require('node:test');const assert=require('node:assert/strict');const {Client}=require('pg');const fs=require('fs');const path=require('path');
test('caller migration preserves bidirectional connections and identifies documented SOAP',async()=>{
 const c=new Client({connectionString:process.env.DATABASE_URL});await c.connect();try{
 await c.query('BEGIN');const schema='test_callers_'+process.pid+'_'+Date.now();await c.query('CREATE SCHEMA "'+schema+'"');await c.query('SET LOCAL search_path TO "'+schema+'"');
 await c.query(`CREATE TYPE "ConnectionType" AS ENUM ('REST','OTHER','SOAP');CREATE TABLE "Solution" (id text PRIMARY KEY,name text);CREATE TABLE "Connection" (id text PRIMARY KEY,"fromId" text REFERENCES "Solution", "toId" text REFERENCES "Solution",type "ConnectionType",description text);CREATE UNIQUE INDEX "Connection_fromId_toId_type_key" ON "Connection"("fromId","toId",type);INSERT INTO "Solution" VALUES ('a','Aplicaciones de Interfaz'),('b','WS_PUNTO_VENTA');INSERT INTO "Connection" VALUES ('soap','b','a','OTHER','Conexion SOAP'),('forward','a','b','REST','keep1'),('reverse','b','a','REST','keep2');`);
 const sql=fs.readFileSync(path.join(__dirname,'../../prisma/migrations/20260917160100_connection_caller_direction/migration.sql'),'utf8');await c.query(sql.replace(/^BEGIN;/m,'').replace(/^COMMIT;/m,''));
 assert.deepEqual((await c.query('SELECT * FROM "Connection" ORDER BY id')).rows,[{id:'forward',fromId:'b',toId:'a',type:'REST',description:'keep1'},{id:'reverse',fromId:'a',toId:'b',type:'REST',description:'keep2'},{id:'soap',fromId:'a',toId:'b',type:'SOAP',description:'Conexion SOAP'}]);
 }finally{await c.query('ROLLBACK');await c.end();}
});
