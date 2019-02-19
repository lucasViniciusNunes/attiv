import {  Sequelize, Transaction} from 'sequelize';

export default class DbContext
{
    private db : Sequelize
    private transaction: Transaction;
    private countTransaction : number;
    

    constructor({ db })
    {
        this.countTransaction = 0;
        this.transaction = null;
        this.db = db.sequelize;
    }

    public getTransaction()
    {
      return this.transaction;
    }

    public async beginTransaction() 
    {
      this.countTransaction++;
      if(this.transaction == null)
      {
        this.transaction = await this.db.transaction({ autocommit: false });
      }
    }

    public commit()
    {
      if (!this.transaction) throw new Error('Sem transação');

      if(this.countTransaction == 1)
      {
        this.transaction.commit();
        this.transaction = null;
      }
      this.countTransaction--;
    }

    public rollback()
    {
      if (!this.transaction) throw new Error('Sem transação');
      if(this.countTransaction == 1)
      {
        this.transaction.rollback();
        this.transaction = null;
      }
      this.countTransaction--;
    }
    
}