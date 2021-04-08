using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Comander.Data;
using Comander.Dtos;
using Comander.Models;
using Commander.Data;
using Commander.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Comander.Controllers
{




    [Route("api/[controller]/[action]")]
    //[Authorize]
    [ApiController]
    public class CompetitionController : ControllerBase
    {
        private readonly IRunRepo _repositoryRun;
        private readonly ICompetitionRepo _repositoryCompetition;
        private readonly IUserRepo _repositoryUsers;
        private readonly IMapper _mapper;
        private IConfiguration _config;

        public CompetitionController(IRunRepo repositoryRun, IUserRepo repositoryUsers, ICompetitionRepo repositoryCompetition, IMapper mapper, IConfiguration config)
        {
            _repositoryRun = repositoryRun;
            _repositoryCompetition = repositoryCompetition;
            _repositoryUsers = repositoryUsers;

            _mapper = mapper;
            _config = config;
        }


        //[Authorize(Policy = "company")]
        [HttpGet]
        public ActionResult test()
        {
            var x = 5;

            return Ok();
        }

        [HttpPost]
        public ActionResult AddCompetition(CompetitionModel competition)
        {
            UserModel owner = UserHandler.GetUserDataByToken(Request.Headers["authorization"]);
            owner = UserHandler.GetUserDataFromDbByLogin(owner.UserLogin);
            competition.ownerId = owner.Id;
            competition.ownerName = owner.UserName;
            #region dbAccess
            string sqlProc = "exec dbo.AddCompetition";
            Dictionary<string, object> queryParams = new Dictionary<string, object> {
                      { "@description",competition.description},
                      { "@startTime",competition.startTime.ToString("yyyy-MM-dd HH:mm")},
                      { "@endTime",competition.endTime.ToString("yyyy-MM-dd HH:mm")},
                      { "@placeOf",competition.placeOf },
                      { "@ownerId",competition.ownerId }
            };
            DbHandler dbHandler = new DbHandler();
            sqlProc = dbHandler.AddParamsToQuery(sqlProc, queryParams);
            try
            {
                UserModel userModel = new UserModel();
                DataSet dataSet = dbHandler.GetSetFromDb(sqlProc, queryParams);
                return Ok(competition);
            }
            catch (Exception e)
            {
                return Conflict(e.Message);
            }

            #endregion

            return Ok();
        }


        [HttpGet]
        public ActionResult<IEnumerable<CompetitionDto>> GetAllCompetitionForUser()
        {
            UserModel user = UserHandler.GetUserDataByToken(Request.Headers["Authorization"]);     
            user = _repositoryUsers.GetUserByLogin(user.UserLogin);
            var competition = _repositoryCompetition.GetAllCompetitionForUser(user.Id);
            return Ok(_mapper.Map<IEnumerable<CompetitionDto>>(competition));
        }


        [HttpGet]
        public ActionResult<IEnumerable<CompetitionDto>> GetAllCompetition()
        {
            //DataSet dataset = new DataSet();
            //SqlDataAdapter adapter = new SqlDataAdapter();
            //adapter.SelectCommand = new SqlCommand(
            //"SELECT * FROM [users]", connectionString);
            //adapter.Fill(dataset);


            //SqlConnection connectionString = new SqlConnection("Server=(localdb)\\MyLocalDB; Initial Catalog=Commander_DB; User ID=CommanderAPI; Password=qwe123qwe;");
            //DataTable dataTable = new DataTable();
            //SqlDataAdapter sqlDataAdapter = new SqlDataAdapter("SELECT * FROM [users]", connectionString);
            ////sqlDataAdapter.SelectCommand.Parameters.AddWithValue("@OrderID", OrderID);
            //sqlDataAdapter.Fill(dataTable);

            //foreach (DataRow orderDataRow in dataTable.Rows)
            //{
            //    Console.WriteLine(orderDataRow);
            //}



                var competition = _repositoryCompetition.GetAllCompetition();

            return Ok(_mapper.Map<IEnumerable<CompetitionDto>>(competition));
        }



        [HttpGet("{id}")]
        public ActionResult<CompetitionDto> GetCompetitionById(string id)
        {
            UserModel user = UserHandler.GetUserDataByToken(Request.Headers["authorization"]);
            user = _repositoryUsers.GetUserByLogin(user.UserLogin);

            var competition = _repositoryCompetition.GetCompetitionById(id);
            if (competition != null)
            {
                if(user.UserType == UserType.person.ToString())
                {
                    return Ok(_mapper.Map<CompetitionDto>(competition));
                }
                if(competition.ownerId != user.Id && user.UserType == UserType.company.ToString())
                {
                    return NotFound();
                }
                return Ok(_mapper.Map<CompetitionDto>(competition));
            }
            return NotFound();
        }

        [HttpPost]
        public ActionResult addRun(RunModel run)
        {
            UserModel owner = UserHandler.GetUserDataByToken(Request.Headers["authorization"]);
            owner = UserHandler.GetUserDataFromDbByLogin(owner.UserLogin);


            //owner = _repositoryUsers.GetUserByLogin(owner.UserLogin);

            run.Id = Guid.NewGuid().ToString();
            run.ownerId = owner.Id;
            _repositoryRun.Register(run);
            _repositoryRun.SaveChanges();

            return Ok();
        }


        [HttpGet("{id}")]
        public ActionResult<IEnumerable<RunDto>> GetRunByCompetitionId(string Id)
        {
            UserModel user = UserHandler.GetUserDataByToken(Request.Headers["authorization"], true);
            string sqlProc = "SELECT * FROM run (NOLOCK) WHERE competitionId = @competitionId";
            Dictionary<string, object> queryParams = new Dictionary<string, object> {
                      { "@competitionId", Id}
            };
            DbHandler dbHandler = new DbHandler();
            DataSet dataSet = dbHandler.GetSetFromDb(sqlProc, queryParams);

            int numberOfRuns = dataSet.Tables["tab"].Rows.Count;
            RunModel[] runModels = new RunModel[numberOfRuns];
            int runIterator = 0;
            foreach (DataRow row in dataSet.Tables["tab"].Rows)
            {
                RunModel runModel = new RunModel();
                runModel.competitionId = row["competitionId"].ToString();
                runModel.Id = row["Id"].ToString();
                runModel.ownerId = row["ownerId"].ToString();
                runModel.description = row["description"].ToString();
                runModel.target = row["target"].ToString();
                runModel.noOfShots = int.Parse(row["noOfShots"].ToString());

                runModels[runIterator] = runModel;
                runIterator++;
            }
            //RunModel[] runModels = GetRunsByCompIdAndUserID(Id, user.Id);

            return Ok(runModels);

            //user = _repositoryUsers.GetUserByLogin(user.UserLogin);
            //var run = _repositoryRun.GetRunByCompetitionId(id);
            //return Ok(_mapper.Map<IEnumerable<RunDto>>(run));
        }


        private RunModel[] GetRunsByCompIdAndUserID(string compId, string userId)
        {

            string sqlProc = "SELECT * FROM run WHERE competitionId = @competitionId AND ownerId = @ownerId";
            Dictionary<string, object> queryParams = new Dictionary<string, object> {
                      { "@competitionId", compId},
                      { "@ownerId", userId}
            };
            DbHandler dbHandler = new DbHandler();
            DataSet dataSet = dbHandler.GetSetFromDb(sqlProc, queryParams);
            var x = dataSet.Tables["tab"].Rows.Count;
            RunModel[] runs = new RunModel[x];
            var i = 0;
            foreach(DataRow row in dataSet.Tables["tab"].Rows)
            {
                RunModel run = new RunModel();
                run.Id = row["Id"].ToString();
                run.competitionId = row["competitionId"].ToString();
                run.ownerId = row["ownerId"].ToString();
                run.description = row["description"].ToString();
                run.target = row["target"].ToString();
                run.noOfShots = int.Parse(row["noOfShots"].ToString());
                runs[i] = run;
                i++;
            }
            return runs;
        }

        [HttpPost]
        public ActionResult GetRegistredUsersByRunId(RunModel runModel)
        {
            UserModel user = UserHandler.GetUserDataByToken(Request.Headers["authorization"], true);
            string sqlProc = "SELECT";
            //Dictionary<string, object> queryParams = new Dictionary<string, object> {
            //          { "@runId", run.Id},
            //          {"@userId", user.Id },
            //          {"@registerdSide", RegistredSide.user.ToString() }
            //};


            return Ok();
        }

        [HttpPost]
        public ActionResult RegisterUserInRun(RunModel run)
        {
            UserModel user = UserHandler.GetUserDataByToken(Request.Headers["authorization"], true);

            string sqlProc = "exec RegisterUserInRun";
            Dictionary<string, object> queryParams = new Dictionary<string, object> {
                      { "@runId", run.Id},
                      {"@userId", user.Id },
                      {"@registerdSide", RegistredSide.user.ToString() }
            };
            DbHandler dbHandler = new DbHandler();
            dbHandler.GenerateProcedure(sqlProc, queryParams);
            sqlProc = dbHandler.AddParamsToQuery(sqlProc, queryParams);
            try
            {
                dbHandler.ExecuteQuery(sqlProc, queryParams);
            }catch(Exception e)
            {
                string response  = JsonConvert.SerializeObject(new { id = run.Id, messege = e.Message});
                return Conflict(response);
            }

            return Ok();
        }


        [HttpPost]
        public ActionResult CreateTarget()
        {
            TargetModel target = new TargetModel();
            target.targetName = "23p";
            target.sizeX = 30;
            target.sizeX = 30;
            target.noOfFields = 7;
            target.url = null;
            target.creator = "AUTO";
            PointPerShot[] pointsPerShot = new PointPerShot[target.noOfFields];
            for (int i = 0; i < target.noOfFields; i++)
            {
                var a = Guid.NewGuid().ToString();
                pointsPerShot[i] = new PointPerShot { fieldId = a, pointPerShot = i + 4, specialPoint = false };
            }
            //var ab = new Guid().ToString();
            //pointsPerShot[10] = new PointPerShot { fieldId = ab, pointPerShot = 10, specialPoint = true };
            //target.pointsPerShot = pointsPerShot;

            string pointsJSON = JsonConvert.SerializeObject(pointsPerShot);
            PointPerShot[] y = JsonConvert.DeserializeObject<PointPerShot[]>(pointsJSON);
            target.pointsPerShot = pointsJSON;

            try
            {
                SaveTargetInDB(target);
            }catch(Exception e)
            {
                return NotFound();
            }


            return Ok();
        }

        [HttpPost]
        public ActionResult FindUserTargetsByToken(TempModel passedTempModel)
        {
            UserModel userModel = UserHandler.GetUserDataByToken(passedTempModel.token);
            userModel = UserHandler.GetUserDataFromDbByLogin(userModel.UserLogin);
            List<TargetModel> targetList = new List<TargetModel>();
            try
            {
                targetList = ReadTargetFromDB(creator: userModel.Id);
                
            }catch(Exception e)
            {
                return NotFound();
            }
            TargetModel[] targets = targetList.ToArray();
            //UnpackTargets(targets);
            return Ok(targets);
        }

        private void UnpackTargets(TargetModel[] targets)
        {
            for(var i = 0; i < targets.Length; i++)
            {
                var x = targets[i];
                var a = x.pointsPerShot;
                PointPerShot[] b = JsonConvert.DeserializeObject<PointPerShot[]>(a);
                targets[i].pointPerShotOBJ = b;




            }
        }

        private void SaveTargetInDB(TargetModel target)
        {
            //var fieldsAsJSON = JsonConvert.SerializeObject(target.pointsPerShot);

            string sqlProc = "exec SaveTargetInDB";
            Dictionary<string, object> queryParams = new Dictionary<string, object> {
                      { "@targetName", target.targetName},
                      { "@sizeX", target.sizeX},
                      { "@sizeY", target.sizeY},
                      { "@noOfFields", target.noOfFields},
                      { "@pointsPerShot", target.pointsPerShot},
                      { "@url", target.url},
                      { "@creator", target.creator},
            };
            DbHandler dbHandler = new DbHandler();
            sqlProc = dbHandler.AddParamsToQuery(sqlProc, queryParams);
            DataSet dataSet = dbHandler.GetSetFromDb(sqlProc, queryParams);

        }
        private List<TargetModel> ReadTargetFromDB(string targetID =null, string creator = null)
        {
            string sqlProc = "exec ReadTargetFromDB";
            Dictionary<string, object> queryParams = new Dictionary<string, object> {
                      { "@targetID", targetID ?? ""},
                      { "@creator", creator ?? ""}
            };
            DbHandler dbHandler = new DbHandler();
            sqlProc = dbHandler.AddParamsToQuery(sqlProc, queryParams);
            DataSet dataSet = dbHandler.GetSetFromDb(sqlProc, queryParams);

            var x = dataSet.Tables["tab"].Rows;
            List<TargetModel> targets = new List<TargetModel>();
            
            string JSONModel = string.Empty;
            foreach (DataRow row in dataSet.Tables["tab"].Rows)
            {
                TargetModel target = new TargetModel();
                target.Id = row["Id"].ToString();
                target.targetName = row["targetName"].ToString();
                target.sizeX = int.Parse(row["sizeX"].ToString());
                target.sizeY = int.Parse(row["sizeX"].ToString());
                target.noOfFields = int.Parse(row["noOfFields"].ToString());
                target.pointsPerShot = row["pointsPerShot"].ToString();
                target.url = row["url"].ToString();
                target.creator = row["creator"].ToString();
                List<PointPerShot> pointsPerShot = new List<PointPerShot>();

                foreach(DataRow rowField in dataSet.Tables["tab1"].Rows)
                {
                    if (rowField["targetID"].ToString() == target.Id)
                    {
                        PointPerShot pointPerShot = new PointPerShot();
                        pointPerShot.fieldId = rowField["ID"].ToString();
                        pointPerShot.pointPerShot = int.Parse(rowField["pointPerShot"].ToString());
                        pointPerShot.specialPoint = Boolean.Parse(rowField["specialShot"].ToString());
                        pointPerShot.creatorID = rowField["creatorID"].ToString();
                        pointsPerShot.Add(pointPerShot);
                    }
                }
                PointPerShot[] pointsPerShotOBJ = pointsPerShot.ToArray();
                target.pointPerShotOBJ = pointsPerShotOBJ;
                targets.Add(target);
            }
            return targets;
        }
    }



    public enum RegistredSide
    {
        user,
        owner
    }
}


